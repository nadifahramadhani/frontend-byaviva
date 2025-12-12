export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-[20px] md:px-[50px] py-10 relative overflow-hidden [background:radial-gradient(50%_50%_at_66%_49%,var(--foundation-accent-1light)_0%,rgba(255,248,238,1)_42%,rgba(222,240,245,1)_76%,rgba(255,248,230,1)_100%)]">
      
      {children}
      
    </div>
  );
}