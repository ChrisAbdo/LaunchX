import { LoginButton } from "@/components/auth/login-button";

export default async function SignInPage() {
  return (
    // <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
    //   <h1>Welcome to LaunchX</h1>
    //   <LoginButton />
    // </div>
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-light leading-9 tracking-tight text-gray-900">
          Welcome to LaunchX
        </h2>
        <p className="text-center">For builders, by builders.</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginButton />
      </div>
    </div>
  );
}
