import { Component, type ErrorInfo, type ReactNode } from "react";
import i18n from "../i18n";

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("The workspace UI crashed", error, info);
  }

  render(): ReactNode {
    if (this.state.failed) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-bg p-6 text-text">
          <div className="panel max-w-md p-8 text-center">
            <h1 className="text-xl font-bold">{i18n.t("errors.crashTitle")}</h1>
            <p className="mt-2 text-sm text-muted">{i18n.t("errors.crashBody")}</p>
            <button
              type="button"
              className="btn-primary mt-6"
              onClick={() => window.location.reload()}
            >
              {i18n.t("common.reload")}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
