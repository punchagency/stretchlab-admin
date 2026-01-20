import { isRouteErrorResponse, useRouteError } from "react-router";
import logo from "@/assets/images/stretchlab.png";
import { Button } from "@/components/shared";

export const ErrorPage = () => {
    const error = useRouteError();
    let errorMessage: string;
    if (isRouteErrorResponse(error)) {
        errorMessage = error.data || error.statusText || `${error.status} ${error.statusText}`;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = 'Unknown error';
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-secondary/20 to-primary-tertiary/30 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <div>
                        <img src={logo} alt="StretchLab" className="w-40 h-auto mx-auto" />
                    </div>
                    <div className="mt-12">
                        <h1 className="text-6xl font-bold text-gray-800 mb-4">Oops!</h1>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                            Something went wrong
                        </h2>
                        <p className="text-base text-gray-600 mb-8 max-w-6xl mx-auto">
                            Sorry, an unexpected error has occurred.            </p>
                        <p className="text-base text-gray-600 mb-8 max-w-6xl mx-auto">
                            {errorMessage}            </p>
                        <div className="flex gap-4 justify-center">

                            <Button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-primary-base text-white hover:bg-primary-base/80 rounded-sm"
                            >
                                Refresh Page
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 