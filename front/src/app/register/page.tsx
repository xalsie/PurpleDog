 "use client";

import { StepperRegisterForm } from "@/features/auth/StepperRegisterForm";
import NavbarHome from "@/components/layout/NavBarHome/NavBarHome";

export default function RegisterPage() {
  return(
    <div>
      <NavbarHome/>
      <StepperRegisterForm />
    </div>
  );
}
