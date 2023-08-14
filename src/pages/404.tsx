import React, { FC } from "react";
import { HeadFC, PageProps } from "gatsby";

export const Head: HeadFC = () => <title>Not found</title>;

const NotFoundPage: FC<PageProps> = () => {
  return <main>404</main>;
};

export default NotFoundPage;
