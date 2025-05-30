import { Input, Button, Spinner } from "@/components/shared";
import {
  verifyCredentials,
  saveSettings,
  updateSettings,
} from "@/service/robot";
import { useState } from "react";
import { renderErrorToast, renderSuccessToast } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import type { ApiError, RobotConfig } from "@/types/response";
import { Config } from "../app";
export const RobotConfigForm = ({
  data,
  refetch,
}: {
  data: RobotConfig;
  refetch: () => void;
}) => {
  const [verified, setVerified] = useState(data ? true : false);
  const [verifying, setVerifying] = useState(false);
  const [isConfig, setIsConfig] = useState(data ? true : false);
  const [editLocation, setEditLocation] = useState(data ? false : true);
  const isEditing = data ? true : false;
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    clubReadyUsername: data?.users?.clubready_username || "",
    clubReadyPassword: data?.users?.clubready_password || "",
    numberOfStudioLocations: data?.number_of_locations || "",
    unloggedBookings: data?.unlogged_booking ? data.unlogged_booking : false,
    dailyRunTime: data?.run_time ? data.run_time : "",
  });
  console.log(data, "config data");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value.trim(),
    });
  };

  const handleVerifyCredentials = async () => {
    setEditLocation(true);
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
          renderSuccessToast(response.data.message);
          setFormData({
            ...formData,
            numberOfStudioLocations: response.data.locations.length,
          });
        } else {
          renderErrorToast(response.data.message);
        }
      } else {
        renderErrorToast(response.data.message);
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response.data.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    console.log(formData);
    if (!formData.numberOfStudioLocations) {
      setFormError("Please enter the number of studio locations");
      return;
    }
    if (!formData.dailyRunTime) {
      setFormError("Please enter the daily run time");
      return;
    }
    try {
      setSaving(true);
      let response;
      if (isEditing) {
        response = await updateSettings({
          ...formData,
          id: data?.id,
          numberOfStudioLocations: parseInt(
            formData.numberOfStudioLocations as string
          ),
        });
      } else {
        response = await saveSettings({
          ...formData,
          numberOfStudioLocations: parseInt(
            formData.numberOfStudioLocations as string
          ),
        });
      }
      if (response.status === 200) {
        renderSuccessToast("Settings saved successfully");
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response.data.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Robot Process Automation</h1>
      {isConfig ? (
        <Config data={data} setIsConfig={setIsConfig} refetch={refetch} />
      ) : (
        <div className="mt-5 flex items-center gap-5 mx-auto w-full max-w-[1550px]">
          <div className="border border-grey-1 w-1/2 rounded-3xl py-6 px-8">
            <h2 className="text-xl font-semibold">Configuration Settings</h2>
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
                    className="bg-[#FFD700] text-sm flex items-center gap-2 text-white py-2"
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
                    className="bg-orange-500 py-2 text-white text-sm"
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
                        disabled={!verified || !editLocation}
                        name="numberOfStudioLocations"
                        placeholder="Enter the number of studio locations"
                        value={formData.numberOfStudioLocations as string}
                        onChange={handleChange}
                      />
                      {/* <Button
                      type="button"
                      className="bg-grey-5 text-white py-1 mb-2 text-xs"
                    >
                      Edit
                    </Button> */}
                    </div>
                    <div>
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
                        <label htmlFor="unlogged-bookings" className="text-sm">
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
                    />
                    {formError && (
                      <div className="bg-red-100 rounded-lg px-2 py-3">
                        <p className="text-red-500 font-medium text-sm text-center">
                          {formError}
                        </p>
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={!verified || saving}
                      className="mt-5 bg-primary-base flex items-center justify-center gap-2 w-full text-white py-4"
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
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
