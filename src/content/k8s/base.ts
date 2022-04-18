import { Resource } from "cdk8s-plus-22";
import { ManifestContainer } from "../../app/manifests";

export abstract class BaseK8s<T> {
  manifestContainer: ManifestContainer;

  constructor(manifestContainer: ManifestContainer) {
    this.manifestContainer = manifestContainer;
  }

  get chart() {
    return this.manifestContainer.chart;
  }

  abstract create(options: T): Resource;
}
