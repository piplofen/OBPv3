// ОБП — корневое приложение: маршрутизация и состояние
const { useState: useAppState } = React;

function App() {
  const [route, setRoute] = useAppState({ page: "home", dirId: null });
  const [modalOpen, setModalOpen] = useAppState(false);

  const nav = (page) => {
    setRoute({ page, dirId: null });
    window.scrollTo(0, 0);
  };
  const openDirection = (dirId) => {
    setRoute({ page: "direction", dirId });
    window.scrollTo(0, 0);
  };
  const onBook = () => setModalOpen(true);

  if (route.page === "lk") {
    return (
      <div data-screen-label="Личный кабинет">
        <LK exit={() => nav("home")}></LK>
      </div>
    );
  }

  let pageEl = null;
  if (route.page === "home") pageEl = <PageHome nav={nav} onBook={onBook} openDirection={openDirection}></PageHome>;
  else if (route.page === "directions") pageEl = <PageDirections openDirection={openDirection} onBook={onBook}></PageDirections>;
  else if (route.page === "direction") pageEl = <PageDirection dirId={route.dirId} nav={nav} openDirection={openDirection} onBook={onBook}></PageDirection>;
  else if (route.page === "doctors") pageEl = <PageDoctors onBook={onBook}></PageDoctors>;
  else if (route.page === "programs") pageEl = <PagePrograms onBook={onBook}></PagePrograms>;
  else if (route.page === "about") pageEl = <PageAbout nav={nav} onBook={onBook}></PageAbout>;

  return (
    <div data-screen-label={"ОБП — " + route.page}>
      <Header nav={nav} route={route.page} onBook={onBook}></Header>
      {pageEl}
      <Footer nav={nav} onBook={onBook}></Footer>
      <AppointmentModal open={modalOpen} onClose={() => setModalOpen(false)} presetDir={route.dirId}></AppointmentModal>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App></App>);
