import { Button } from "../shared";

export const ErrorHandle = ({ retry }: { retry: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-2xl font-bold">An Error Occured</h3>
      <p className="text-sm text-gray-500">
        An error occured while fetching the data
      </p>
      <Button
        onClick={retry}
        className="mt-4 bg-primary-base py-1 px-2 text-white font-semibold"
      >
        Retry
      </Button>
    </div>    
  );   
};
