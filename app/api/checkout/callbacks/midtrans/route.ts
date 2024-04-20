export async function GET(req: Request, res: Response) {
    console.log('webhook: ', {
        headers: Array.from(req.headers.entries()).map((key, value) => ({key, value})),
        data: await req.json(),
    });
    // Return response connected to readable
    return Response.json({
        ok: true,
    });
}
