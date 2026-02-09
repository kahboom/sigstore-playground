import { Component } from 'solid-js';
import './LoadingSkeleton.css';

export const LoadingSkeleton: Component = () => {
  return (
    <div class="loading-skeleton">
      <div class="skeleton-header">
        <div class="skeleton-title" />
        <div class="skeleton-subtitle" />
      </div>
      <div class="skeleton-content">
        <div class="skeleton-card" />
        <div class="skeleton-card" />
        <div class="skeleton-card" />
      </div>
    </div>
  );
};
