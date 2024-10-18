import { CollectionPoint, collectionPointSchema } from "../ConsentManager";

export const createCollectionPointStub = (): CollectionPoint => {
  const collectionPoints: CollectionPoint[] = collectionPointSchema.options.map(
    (option) => option.value,
  );

  return collectionPoints[Math.floor(Math.random() * collectionPoints.length)]!;
};
