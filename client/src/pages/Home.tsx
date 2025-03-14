import Header from "@/components/Header";
import ImageContainer from "@/components/ImageContainer";
import ControlsContainer from "@/components/ControlsContainer";
import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import { useQuery, useMutation } from "@tanstack/react-query";

const Home = () => {
  const {
    data: catImage,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/cat'],
    refetchOnWindowFocus: false,
  });

  const newCatMutation = useMutation({
    mutationFn: async () => {
      await refetch();
    },
  });

  const handleNewCatRequest = () => {
    newCatMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <ImageContainer 
            catImage={catImage} 
            isLoading={isLoading || newCatMutation.isPending} 
            hasError={!!error} 
          />
          <ControlsContainer 
            onNewCat={handleNewCatRequest} 
            isLoading={isLoading || newCatMutation.isPending} 
          />
          <FeatureSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
