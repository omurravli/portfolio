"use client";

import { Component, type ReactNode } from "react";

export default class SceneErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("3D scene failed to render, falling back:", error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
