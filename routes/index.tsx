import AppCard from "../components/AppCard.tsx";

export default function Home() {
  const appsInfo = [
    {
      name: "Program",
      description: `通知する番組を設定`,
      link: `/program`,
    },
    {
      name: "NHK API",
      description: `NHK APIキーを設定`,
      link: `/nhkapi`,
    },
    {
      name: "Notification",
      description: `通知タイプを設定`,
      link: `/notification`,
    },
  ];

  return (
    <>
      <div className="space-y-4">
        {appsInfo.map(({ name, description, link }) => {
          return <AppCard name={name} description={description} link={link} />;
        })}
      </div>
    </>
  );
}
