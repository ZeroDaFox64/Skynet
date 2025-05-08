import Banner from "../../components/landing/Banner";
import Catalog from "../../components/landing/Catalog";
import Stats from "../../components/landing/Stats";
import Header from "../../components/landing/Header";
import Trend from "../../components/landing/Trend";
import db_store from "../../db_store";
import Newsletter from "../../components/landing/Newsletter";

function App() {
  return (
        <>
          <title>{db_store.name} | Inicio</title>
          <Header />
          <Trend ContainerStyles="my-24" />
          <Banner ContainerStyles="my-24" />
          <Stats ContainerStyles="my-36" />
          <Catalog ContainerStyles="my-24"/>
          <Newsletter ContainerStyles="my-24"/>
        </>
  );
}

export default App;
