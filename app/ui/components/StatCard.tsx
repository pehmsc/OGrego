type Props = {
    title: string;
    value: string;
};

export default function StatCard({ title, value }: Props) {
    return (
        <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );
}
