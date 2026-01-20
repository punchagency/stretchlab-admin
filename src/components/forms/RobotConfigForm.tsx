import { Input, Button, Spinner } from "@/components/shared";
import {
  verifyCredentials,
  saveSettings,
  updateSettings,
} from "@/service/robot";
import { useState } from "react";
import { renderErrorToast, renderSuccessToast } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import type { ApiError, RobotConfig, Location } from "@/types/response";
import { Config, PaymentCollection } from "../app";
import type { BillingInfo } from "@/types";
import { setUserCookie, setRefreshToken } from "@/utils";
import { useNavigate } from "react-router";

export const RobotConfigForm = ({
  data,
  refetch,
  isSignupFlow = false,
}: {
  data?: RobotConfig;
  refetch: () => void;
  isSignupFlow?: boolean;
}) => {
  const navigate = useNavigate();
  // const [verified, setVerified] = useState(data ? true : false);
  const [verified, setVerified] = useState(false)
  const [verifying, setVerifying] = useState(false);
  const [isConfig, setIsConfig] = useState(data ? true : false);
  // const [editLocation, setEditLocation] = useState(data ? false : true);
  const isEditing = data ? true : false;
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState(false);
  const [update, setUpdate] = useState(false);
  const [proceed, setProceed] = useState(false);


  const parseLocations = (locationData: any): Location[] => {
    if (Array.isArray(locationData)) return locationData;
    if (typeof locationData === 'string') {
      try {
        const parsed = JSON.parse(locationData);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error parsing locations:', e);
        return [];
      }
    }
    return [];
  };

  const parseExcludedNames = (excludedData: any): string[] => {
    if (Array.isArray(excludedData)) return excludedData;
    if (typeof excludedData === 'string') {
      try {
        const parsed = JSON.parse(excludedData);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error parsing excluded names:', e);
        return [];
      }
    }
    return [];
  };

  const [locations, setLocations] = useState<Location[]>(parseLocations(data?.locations));
  const [selectedLocations, setSelectedLocations] = useState<Location[]>(parseLocations(data?.selected_locations));

  const [formData, setFormData] = useState({
    clubReadyUsername: data?.users?.clubready_username || "",
    clubReadyPassword: data?.users?.clubready_password || "",
    numberOfStudioLocations: data?.number_of_locations?.toString() || parseLocations(data?.selected_locations).length.toString(),
    excludeClientNames: parseExcludedNames((data as any)?.excluded_names).join(", "),
    // unloggedBookings: data?.unlogged_booking ? data.unlogged_booking : false,
    // dailyRunTime: data?.run_time ? data.run_time : "09:00",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : (name === "excludeClientNames" ? value : value.trim()),
    });
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocations(prev => {
      const isSelected = prev.some(loc => loc.location_id === location.location_id);
      if (isSelected && prev.length === 1) {
        return prev;
      }

      const newSelected = isSelected
        ? prev.filter(loc => loc.location_id !== location.location_id)
        : [...prev, location];
      setFormData(currentFormData => ({
        ...currentFormData,
        numberOfStudioLocations: newSelected.length.toString(),
      }));

      return newSelected;
    });
  };

  const handleVerifyCredentials = async () => {
    // setEditLocation(true);
    setError("");
    if (!formData.clubReadyUsername || !formData.clubReadyPassword) {
      setError("Please enter your ClubReady username and password");
      return;
    }
    try {
      setVerifying(true);
      const response = await verifyCredentials({
        username: formData.clubReadyUsername,
        password: formData.clubReadyPassword,
      });
      if (response.status === 200) {
        if (response.data.status) {
          setVerified(true);
          const newLocations: Location[] = response.data.locations;
          setLocations(newLocations);

          if (selectedLocations.length === 0) {
            setSelectedLocations(newLocations);
            setFormData(prev => ({
              ...prev,
              numberOfStudioLocations: newLocations.length.toString(),
            }));
          } else {
            const validSelections = selectedLocations.filter(sel =>
              newLocations.some(loc => loc.location_id === sel.location_id)
            );
            setSelectedLocations(validSelections);
            setFormData(prev => ({
              ...prev,
              numberOfStudioLocations: validSelections.length.toString(),
            }));
          }
        } else {
          renderErrorToast(response.data.message);
        }
      } else {
        renderErrorToast(response.data.message);
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response.data.message || "Something went wrong, please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    if (!formData.numberOfStudioLocations) {
      setFormError("Please select at least one location");
      return;
    }
    if (selectedLocations.length === 0) {
      setFormError("Please select at least one location");
      return;
    }
    try {
      setSaving(true);
      let response;
      if (isEditing) {
        let excludeClientNames: string[] = [];
        if (formData.excludeClientNames && formData.excludeClientNames.length > 0) {
          excludeClientNames = formData.excludeClientNames.split(",");
        }
        response = await updateSettings({
          // ...formData,
          clubReadyUsername: formData.clubReadyUsername,
          clubReadyPassword: formData.clubReadyPassword,
          id: data!.id,
          numberOfStudioLocations: parseInt(
            formData.numberOfStudioLocations as string
          ),
          selectedStudioLocations: selectedLocations,
          studioLocations: locations,
          excludedNames: excludeClientNames.filter((name: string) => name.trim().length > 0),
        });
      } else {
        let excludeClientNames: string[] = [];
        if (formData.excludeClientNames && formData.excludeClientNames.length > 0) {
          excludeClientNames = formData.excludeClientNames.split(",");
        }
        response = await saveSettings({
          proceed,
          clubReadyUsername: formData.clubReadyUsername,
          clubReadyPassword: formData.clubReadyPassword,
          numberOfStudioLocations: parseInt(
            formData.numberOfStudioLocations as string
          ),
          selectedStudioLocations: selectedLocations,
          studioLocations: locations,
          excludedNames: excludeClientNames.filter((name: string) => name.trim().length > 0),
        });
      }
      if (response.status === 200) {
        renderSuccessToast("Settings saved successfully");
        if (isSignupFlow) {
          setUserCookie(response.data.access_token);
          if (response.data.refresh_token) {
            setRefreshToken(response.data.refresh_token);
          }
          navigate("/dashboard");
          return;
        }

        refetch();
        setIsConfig(true);
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response.status === 402) {

        if (apiError.response.data.payment_id) {
          setPaymentInfo(true);
          setBillingInfo(apiError.response.data.payment_info as BillingInfo);
        } else {
          renderErrorToast(apiError.response.data.message || "Something went wrong, please try again.");
          setPaymentInfo(true);
        }
      } else {

        renderErrorToast(apiError.response.data.message || "Something went wrong, please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (isSignupFlow) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Robot Process Automation Setup
          </h2>

          <form className="space-y-6" onSubmit={handleSaveSettings}>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">ClubReady Credentials</h3>

              <Input
                label="ClubReady Username"
                type="text"
                name="clubReadyUsername"
                disabled={verified || verifying}
                placeholder="Enter your ClubReady username"
                value={formData.clubReadyUsername}
                onChange={handleChange}
                helperText="Enter your ClubReady username or create an admin ClubReady account."
              />

              <Input
                label="ClubReady Password"
                type="password"
                name="clubReadyPassword"
                disabled={verified || verifying}
                placeholder="Enter your ClubReady password"
                value={formData.clubReadyPassword}
                onChange={handleChange}
                helperText="Enter your ClubReady password."
              />

              {error && (
                <div className="bg-red-100 rounded-lg px-4 py-3">
                  <p className="text-red-600 text-sm font-medium text-center">
                    {error}
                  </p>
                </div>
              )}

              {!verified ? (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleVerifyCredentials}
                    className="bg-[#FFD700] hover:bg-[#E6C200] text-black font-medium py-2 px-6 rounded-lg flex items-center gap-2"
                    disabled={verifying}
                  >
                    {verifying ? (
                      <>
                        <Spinner />
                        Verifying...
                      </>
                    ) : (
                      "Verify Credentials"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button
                    className="bg-primary-base hover:bg-primary-base/80 text-white font-medium py-2 px-6 rounded-lg"
                    type="button"
                    onClick={() => setVerified(false)}
                  >
                    ✓ Credentials Verified - Re-verify
                  </Button>
                </div>
              )}
            </div>

            {/* Location Selection Section */}
            <AnimatePresence>
              {verified && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-medium">Select Studio Locations</h3>
                  <p className="text-sm text-gray-600">
                    All locations are selected by default. Unselect any locations you don't want to enable robot automation for ({locations.length} locations found)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
                    {locations.map((location) => {
                      const isSelected = selectedLocations.some(
                        (loc) => loc.location_id === location.location_id
                      );
                      return (
                        <div
                          key={location.location_id}
                          onClick={() => handleLocationSelect(location)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-300 bg-white hover:border-gray-400"
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-sm">{location.location_name}</h4>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                              }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* <div className="bg-primary-base/10 rounded-lg p-3">
                     <p className="text-sm text-primary-base">
                       <strong>{selectedLocations.length} of {locations.length} location{selectedLocations.length > 1 ? 's' : ''} selected</strong>
                       {selectedLocations.length === 0 && (
                         <span className="text-red-600 ml-2">⚠️ You must select at least one location</span>
                       )}
                     </p>
                   </div> */}

                  <Input
                    label="Number of Studio Locations"
                    type="number"
                    name="numberOfStudioLocations"
                    placeholder="Number of selected locations"
                    value={formData.numberOfStudioLocations}
                    onChange={handleChange}
                    disabled={true}
                    helperText="This will automatically update based on your selected locations"
                  />
                  <Input
                    label="Enter Client Name To Exclude"
                    type="text"
                    name="excludeClientNames"
                    placeholder="Enter client name to exclude"
                    value={formData.excludeClientNames}
                    onChange={handleChange}
                    helperText="Enter client name to exclude from robot automation"
                  />
                  {formError && (
                    <div className="bg-red-100 rounded-lg px-4 py-3">
                      <p className="text-red-600 text-sm font-medium text-center">
                        {formError}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={saving || selectedLocations.length === 0}
                      className="flex-1 bg-primary-base hover:bg-primary-base/80 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Spinner />
                          Saving...
                        </>
                      ) : (
                        "Complete Setup"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {paymentInfo && (
          <PaymentCollection
            show={paymentInfo}
            onClose={() => setPaymentInfo(false)}
            billingInfo={billingInfo}
            robot={true}
            // update={false}
            // setUpdate={() => { }}
            update={update}
            setUpdate={setUpdate}
            setProceed={setProceed}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div>
        {isConfig && data ? (
          <Config data={data} setIsConfig={setIsConfig} refetch={refetch} />
        ) : (
          <div className="mt-5 block md:flex items-center gap-5 mx-auto w-full max-w-[1550px]">
            <div className="border border-grey-1 w-full lg:w-1/2 rounded-3xl py-6 px-4 md:px-8">
              <h2 className="text-lg md:text-xl font-semibold">
                Configuration Settings
              </h2>
              <form
                className="mt-8 flex flex-col gap-5"
                onSubmit={handleSaveSettings}
              >
                <Input
                  label="ClubReady Username"
                  type="text"
                  name="clubReadyUsername"
                  disabled={verified || verifying}
                  placeholder="Enter your ClubReady username"
                  value={formData.clubReadyUsername}
                  onChange={handleChange}
                  helperText="Enter your ClubReady username or create an admin ClubReady account and enter the username."
                />

                <Input
                  label="ClubReady Password"
                  type="password"
                  name="clubReadyPassword"
                  disabled={verified || verifying}
                  placeholder="Enter your ClubReady password"
                  helperText="Enter your ClubReady password or create an admin ClubReady account and enter the password."
                  value={formData.clubReadyPassword}
                  onChange={handleChange}
                />
                {error && (
                  <div className="bg-red-100 rounded-lg px-2 py-3">
                    <p className="text-red-500 font-medium text-sm text-center">
                      {error}
                    </p>
                  </div>
                )}
                {!verified ? (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleVerifyCredentials}
                      className="bg-[#FFD700] text-xs md:text-sm flex items-center gap-2 text-white py-2"
                      disabled={verifying}
                    >
                      {verifying ? (
                        <>
                          <Spinner />
                          Verifying...
                        </>
                      ) : (
                        "Verify Credentials"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      className="bg-orange-500 py-2 text-white text-xs md:text-sm"
                      type="button"
                      onClick={() => {
                        setVerified(false);
                      }}
                    >
                      Re-Verify Credentials
                    </Button>
                  </div>
                )}

                <AnimatePresence>
                  {verified && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div>
                        <Input
                          label="Number of Studio Locations"
                          type="number"
                          disabled={true}
                          name="numberOfStudioLocations"
                          placeholder="Number of selected locations"
                          value={formData.numberOfStudioLocations}
                          onChange={handleChange}
                          helperText="This will automatically update based on your selected locations"
                        />
                      </div>

                      <div>
                        <Input
                          label="Enter Client Name To Exclude"
                          type="text"
                          name="excludeClientNames"
                          placeholder="Enter client name to exclude"
                          value={formData.excludeClientNames}
                          onChange={handleChange}
                          helperText="Enter client name to exclude from robot automation"
                        />
                      </div>

                      {/* Location Selection */}
                      {locations.length > 0 && (
                        <div className="space-y-3 mt-4">
                          <p className="text-xs font-medium text-gray-600">
                            {selectedLocations.length} of {locations.length} Select Studio Locations
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                            {locations.map((location) => {
                              const isSelected = selectedLocations.some(
                                (loc) => loc.location_id === location.location_id
                              );
                              return (
                                <div
                                  key={location.location_id}
                                  onClick={() => handleLocationSelect(location)}
                                  className={`p-2 rounded-md border cursor-pointer transition-all duration-200 text-xs ${isSelected
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                    }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h5 className="font-medium text-xs">{location.location_name}</h5>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${isSelected
                                      ? "border-green-500 bg-green-500"
                                      : "border-gray-300"
                                      }`}>
                                      {isSelected && (
                                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                        </div>
                      )}

                      {/* Commented out sections */}
                      {/* <div>
                        <p className="text-base mb-2">Select Process</p>
                        <div className="flex items-center gap-2 mb-4">
                          <input
                            id="unlogged-bookings"
                            type="checkbox"
                            name="unloggedBookings"
                            className="form-checkbox w-4 h-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            onChange={handleChange}
                            checked={formData.unloggedBookings}
                            disabled={!verified}
                          />
                          <label
                            htmlFor="unlogged-bookings"
                            className="text-sm"
                          >
                            Unlogged Bookings
                          </label>
                        </div>
                      </div>
                      <Input
                        label="Daily Run Time"
                        type="time"
                        name="dailyRunTime"
                        value={formData.dailyRunTime}
                        disabled={!verified}
                        onChange={handleChange}
                      /> */}

                      {formError && (
                        <div className="bg-red-100 rounded-lg px-2 py-3">
                          <p className="text-red-500 font-medium text-sm text-center">
                            {formError}
                          </p>
                        </div>
                      )}
                      <div className="flex gap-6 items-center">
                        {isEditing && (
                          <Button
                            type="button"
                            onClick={() => {
                              setIsConfig(true);
                            }}
                            className="mt-5 bg-grey-1 flex items-center justify-center gap-2 w-full text-dark-1 py-3 md:py-4 text-xs md:text-base"
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          type="submit"
                          disabled={!verified || saving || selectedLocations.length === 0}
                          className="mt-5 bg-primary-base flex items-center justify-center gap-2 w-full text-white py-3 md:py-4 text-xs md:text-base"
                        >
                          {saving ? (
                            <>
                              <Spinner />
                              {isEditing ? "Updating..." : "Saving..."}
                            </>
                          ) : isEditing ? (
                            "Update Settings"
                          ) : (
                            "Save Settings"
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        )}
      </div>
      {paymentInfo && (
        <PaymentCollection
          show={paymentInfo}
          onClose={() => setPaymentInfo(false)}
          billingInfo={billingInfo}
          robot={true}
          update={update}
          setUpdate={setUpdate}
          setProceed={setProceed}
        />
      )}
    </>
  );
};