import { RobotConfigForm } from "@/components/forms";
import logo from "@/assets/images/stretchlab.png";
import { getUserInfo } from "@/utils";
import { Navigate } from "react-router";

export const RobotSetup = () => {
  const userInfo = getUserInfo();
  if (userInfo?.role_id === 4) {  
    return <Navigate to="/dashboard" />;
  }
  if (userInfo?.rpa_verified) {
    return <Navigate to="/" />; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-secondary/20 to-primary-tertiary/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div >
            <img src={logo} alt="StretchLab" className="w-40 h-auto mx-auto" />
          </div>
          <p className="text-base md:text-lg text-gray-600 mt-1">
            Let's set up your robot automation to get started
          </p>
        </div>
        <RobotConfigForm refetch={() => { }} isSignupFlow={true} />
      </div>
    </div>
  );
}; 