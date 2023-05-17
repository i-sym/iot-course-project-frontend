import Header from "../../common/header/Header";
import Container from "../../common/layout/Container";
import DevicesSection from "./DevicesSection";
import StatsSection from "./StatsSection";
import { QueryClient, QueryClientProvider } from "react-query";
import ScenesSection from "./ScenesSection";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full min-h-screen bg-gray-200 pb-32">
        <Header />
        <Container className="mt-6">
          <div className="flex flex-row items-center max-w-lg text-sm text-gray-700 font-semibold mx-auto">
            <div><ExclamationTriangleIcon className="text-red-500 h-16 w-16 mr-6"/></div>
            <div>Note: This is a demo version. Statistics and devices should not be visible in production version. Hovever, anonymus users are still able to see them, but not change the state of the devices</div>
          </div>
        </Container>
        <Container className="mt-24">
          <h1 className="text-4xl font-bold mt-12">Activity</h1>
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
              <StatsSection />
            </div>
          </div>
        </Container>

        <Container className="mt-24">
          <h1 className="text-4xl font-bold mt-12">Devices</h1>
          <div className="mt-6">
            <DevicesSection />
          </div>
        </Container>
        <Container className="mt-24">
          <h1 className="text-4xl font-bold mt-12">Scenes</h1>
          <div className="mt-6">
            <ScenesSection/>
          </div>
        </Container>
      </div>
    </QueryClientProvider>
  );
}
