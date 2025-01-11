import PageCard from "../components/PageCard.tsx";

export default function Home() {
  const settings = [
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
        {settings.map(({ name, description, link }) => (
          <PageCard name={name} description={description} link={link} />
        ))}
      </div>
    </>
  );
}
