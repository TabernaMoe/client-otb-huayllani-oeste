import { Component } from 'react';
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Ocurrió un error inesperado al mostrar esta vista.',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, errorMessage: '' });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (typeof window !== 'undefined') {
      window.location.assign(this.props.homePath || '/');
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const fullScreen = this.props.fullScreen ?? false;

    return (
      <div
        className={
          fullScreen
            ? 'flex min-h-screen items-center justify-center bg-slate-50 p-6'
            : 'flex min-h-[360px] items-center justify-center p-6'
        }
      >
        <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <ExclamationTriangleIcon className="h-7 w-7" />
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            Algo salió mal en esta pantalla
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {this.state.errorMessage}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Reintentar
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <HomeIcon className="h-4 w-4" />
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }
}
