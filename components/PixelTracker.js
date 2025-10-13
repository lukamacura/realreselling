    // components/PixelTracker.js
    import { useEffect } from "react";
    import ReactPixel from "react-facebook-pixel";
    import { useRouter } from "next/router"; // For _app.js method
    // For App Router (Next.js 13+), use `usePathname` and `useSearchParams`
    // import { usePathname, useSearchParams } from 'next/navigation'; 

    const PixelTracker = () => {
      const router = useRouter(); // For _app.js method
      // const pathname = usePathname(); // For App Router
      // const searchParams = useSearchParams(); // For App Router

      useEffect(() => {
        const pixelId = "YOUR_PIXEL_ID"; // Replace with your actual Pixel ID
        ReactPixel.init(pixelId);
        ReactPixel.pageView();

        // Track page views on route changes (for Pages Router)
        const handleRouteChange = () => {
          ReactPixel.pageView();
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
          router.events.off("routeChangeComplete", handleRouteChange);
        };

        // For App Router: Track page views on pathname/searchParams changes
        // if (pathname || searchParams) {
        //   ReactPixel.pageView();
        // }

      }, [router]); // Add dependencies for App Router if needed

      return null;
    };

    export default PixelTracker;