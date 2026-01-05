// src/components/shared/InfoList.jsx
const InfoList = ({ items }) => {
  return (
    <dl className="flex flex-col gap-3 w-full">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-4 lg:p-5 bg-graygray-5 rounded-lg border border-transparent hover:border-graygray-20 transition-all"
        >
          <dt className="text-body-s text-graygray-70">{item.label}</dt>
          <dd className="text-body-m-bold text-graygray-90 text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default InfoList;