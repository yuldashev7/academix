import { mobilePaymentT } from '@/app/types/types';

const MobilePayments = ({ student, course }: mobilePaymentT) => {
  return (
    <div className="space-y-4 lg:hidden mt-4">
      {student.map((s: any, index: any) => {
        const courseData = course.find(
          (c: any) => Number(c.id) === Number(s.courseId)
        );

        return (
          <div key={s.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <p className="text-gray-600 text-sm">#{index + 1}</p>

            <h2 className="text-lg font-semibold">
              {courseData?.name || 'Kurs topilmadi'}
            </h2>

            <div className="mt-2 space-y-1 text-sm">
              <p>
                <span className="font-medium">To‘langan: </span>
                {s.paidAmount} UZS
              </p>
              <p>
                <span className="font-medium">Har oy: </span>
                {courseData?.price ?? 0} UZS
              </p>
              <p>
                <span className="font-medium">To‘liq narx: </span>
                {courseData?.fullPrice ?? 0} UZS
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MobilePayments;
