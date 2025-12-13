import React from 'react'
import JobCard from './JobCard';
// import GetAllJobs from '../hooks/useGetAllJobs';
import useGetAllJobs from '../hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import { useNavigate } from 'react-router-dom';

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job)
    useGetAllJobs()
  return (

    <div>
        <div className="p-5 mt-5"> 
            <div className='pl-5 text-3xl font-bold text-[#232c36]'> Check Out <span className='text-[#3A506B]'>Recently Posted Jobs</span> </div>
            <div className='grid grid-col gap-10 md:grid-cols-2 lg:grid-cols-3 mt-7   '>
                {
                   allJobs.slice(0,6).map((item)=>(<JobCard  key={item._id} job={item} />))
                }
            </div>
        </div>
    </div>
  )
}

export default LatestJobs