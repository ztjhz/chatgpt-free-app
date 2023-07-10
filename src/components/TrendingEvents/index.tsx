import { request } from "@api/request";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EventItem } from "./eventItem";


export const TrendingEvents = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    (async () => {
      setLoading(true)
      const {data} = await request.get<any>("/trending/daily_events")
      setData(data?.data)
      setLoading(false)
    })()
  }, [1])

  return (
    <div className="mt-2 md:mt-10 bg-bg-50 md:rounded-2xl p-4 md:px-6 border border-bg-200">
      <div className="text-md text-white mb-4">
        {t('trendingEvent')}
      </div> 

      <ol className="relative border-l border-gray-200 dark:border-gray-700">                  
        {data.map((item: any) => {
          return (
            <EventItem event={item} key={item.question} />
          )
        })}
      </ol>
    </div>
  )
}