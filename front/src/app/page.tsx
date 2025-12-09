import ParticularForm  from "@/components/ParticularForm/ParticularForm";
import ProForm from "@/components/ProForm/ProForm"

export default function Home({}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <ParticularForm FormMode="login"/>  
      <ProForm FormMode="login"/>
    </div>
  );
}
