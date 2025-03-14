import Header from "@/components/Header";
import ImageContainer from "@/components/ImageContainer";
import ControlsContainer from "@/components/ControlsContainer";
import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CatImage } from "@shared/schema";

const Home = () => {
  const {
    data: catImage,
    isLoading: queryLoading,
    error,
    refetch
  } = useQuery<CatImage>({
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

  const loadingState = queryLoading || newCatMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <ImageContainer 
            catImage={catImage} 
            isLoading={loadingState} 
            hasError={!!error} 
          />
          <ControlsContainer 
            onNewCat={handleNewCatRequest} 
            isLoading={loadingState}
            catImage={catImage}
          />
          <FeatureSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
