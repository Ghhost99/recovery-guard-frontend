import { useNavigate } from "react-router-dom";
import Navbar from "@components/navbar";
import Hero from "@components/hero";
import AnimatedIcons from "@components/animatedIcons";
import Features from "@components/features";
import Footer from "@components/footer";
import FeaturedArticles from "@components/articles";

function Home() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <>
      <Navbar />
      <Hero />
      <AnimatedIcons />
      <Features />
      {/* <FeaturedArticles/> */}
      <Footer />
    </>
  );
}

export default Home;
