"use client";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-100 p-6 font-sans">
      <div className="flex flex-col items-center justify-center max-w-2xl text-center">
        <div className="text-2xl font-bold">Welcome!</div>
        <div>If you see this, you have successfully started running the template application!</div>
        <div>However, there is definitely more work to be done to turn this into a real weather app. </div>

        <div>Now that you can see this, you should have a look at the Readme.md files in src/lib and src/components</div>
      </div>
    </div>
  );
}
