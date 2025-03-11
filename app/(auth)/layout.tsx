export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center relative">
      <div className="w-full max-w-md p-4 md:p-6 lg:p-8 relative z-10">
        {children}
      </div>
    </main>
  );
}
