import React from "react";
import { Route } from "react-router-dom";
const App: React.FC = () => {
  return (
    <div>
      <Route
        exact
        path="/main"
        component={require("../views/workspace/workspace").default}
      />
      <Route
        exact
        path="/main/order"
        component={require("../views/order/order").default}
      />
      <Route
        exact
        path="/main/spec"
        component={require("../views/spec/spec").default}
      />
      <Route
        exact
        path="/main/api"
        component={require("../views/order/api/api").default}
      />
      <Route
        exact
        path="/main/Inquire"
        component={require("../views/order/Inquire/Inquire").default}
      />
      
      <Route
        exact
        path="/main/finance/direct"
        component={require("../views/finance/direct/direct").default}
      />
      <Route
        exact
        path="/main/finance/analysis"
        component={require("../views/finance/analysis/analysis").default}
      />

      <Route
        exact
        path="/main/pocket/poster"
        component={require("../views/pocket/poster/poster").default}
      />
      <Route
        exact
        path="/main/pocket/shop"
        component={require("../views/pocket/shop/shop").default}
      />
      <Route
        exact
        path="/main/pocket/order"
        component={require("../views/pocket/order/order").default}
      />
      <Route
        exact
        path="/main/official/article"
        component={require("../views/official/article").default}
      />
      <Route
        exact
        path="/main/official/exam"
        component={require("../views/official/exam").default}
      />
      <Route
        exact
        path="/main/official/category"
        component={require("../views/official/category").default}
      />
    </div>
  );
};
export default App;
