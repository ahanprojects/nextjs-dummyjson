
export default function SnackBar({ message }: { message: string }) {
  return (
    <div>
      { message && <div className="fixed bottom-4 right-4 shadow-lg bg-green-600 text-white px-8 py-2 rounded-lg">
        <p>{message}</p>
      </div> }
    </div>
  )
}
