import { ComponentType } from "react";
import AnimatedPage from "./AnimatedPage";

function withAnimation<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function AnimatedComponent(props: P) {
    return (
      <AnimatedPage>
        <WrappedComponent {...props} />
      </AnimatedPage>
    );
  };
}

export default withAnimation;
