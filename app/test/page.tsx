const Page = async () => {
  const data = await fetch('https://api.aiterview.tech/oracledb');

  const res = await data.json();

  return <div>1</div>;
};

export default Page;
