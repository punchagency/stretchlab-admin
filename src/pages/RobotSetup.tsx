import { RobotConfigForm } from "@/components/forms";

export const RobotSetup = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to StretchLab!
          </h1>
          <p className="text-lg text-gray-600">
            Let's set up your robot automation to get started
          </p>
        </div>
        <RobotConfigForm refetch={() => {}} isSignupFlow={true} />
      </div>
    </div>
  );
}; 