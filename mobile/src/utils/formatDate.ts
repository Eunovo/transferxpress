export const formatDate = (value: string) => {
    const date = new Date(value);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };
  