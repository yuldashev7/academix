import { toast } from 'sonner';

const GetContracts = async () => {
  try {
    const res = await fetch('http://localhost:3600/contracts');

    if (!res.ok) {
      toast.error("Shartnomani yuklab bo'lmadi");
    }
    return await res.json();
  } catch (error) {
    toast.error('Xatolik yuz berdi');
  }
};

export default GetContracts;
