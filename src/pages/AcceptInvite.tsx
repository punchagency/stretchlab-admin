import logo from "@/assets/images/stretchlab.png";
import { InviteForm } from "@/components/forms";

export const AcceptInvite = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-secondary/20 to-primary-tertiary/30 py-8">
            <div className="max-w-5xl mx-auto px-4 flex flex-col gap-6" >

                <div>
                    <img src={logo} alt="StretchLab" className="w-40 h-auto mx-auto" />
                </div>
                <InviteForm />

            </div>
        </div>
    );
};  