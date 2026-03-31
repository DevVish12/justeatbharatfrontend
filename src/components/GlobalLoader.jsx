import logo from "@/assets/logoL.png";

const GlobalLoader = ({ message = "Loading…" }) => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-muted"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-24 w-24">
          <div
            className="absolute inset-0 rounded-full border-4 border-muted-foreground/20 border-t-foreground animate-spin motion-reduce:animate-none [animation-duration:1800ms]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background rounded-full p-4 border">
              <img
                src={logo}
                alt="Loading"
                className="h-14 w-14 object-contain"
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">{message}</div>
      </div>
    </div>
  );
};

export default GlobalLoader;
