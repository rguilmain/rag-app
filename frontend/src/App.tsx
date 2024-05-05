import Alert from "./components/Alert";
import ListGroup from "./components/ListGroup";

function App() {
  let models = ["GPT-3.5", "GPT-4"];

  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  return (
    <div>
      <Alert>
        Hello <em>world!</em>
      </Alert>
      <ListGroup
        heading="Models"
        items={models}
        onSelectItem={handleSelectItem}
      />
    </div>
  );
}

export default App;
