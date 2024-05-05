import { useState } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";
import ListGroup from "./components/ListGroup";

function App() {
  const [alertVisible, setAlertVisibility] = useState(false);

  let models = ["GPT-3.5", "GPT-4"];

  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  return (
    <div>
      <ListGroup
        heading="Models"
        items={models}
        onSelectItem={handleSelectItem}
      />
      <Button onClick={() => setAlertVisibility(true)}>Search</Button>
      {alertVisible && (
        <Alert onClose={() => setAlertVisibility(false)}>
          <strong>Searching!</strong> You should see your results soon.
        </Alert>
      )}
    </div>
  );
}

export default App;
