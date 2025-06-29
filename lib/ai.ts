export async function getJobListingData(url: string) {
  try {
    // First, fetch the job HTML
    const fetchRes = await fetch("/api/fetch-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!fetchRes.ok) {
      throw new Error(`Fetch API request failed: ${fetchRes.status}`);
    }

    const fetchData = await fetchRes.json();
    if (fetchData.error) {
      throw new Error(fetchData.error);
    }

    // Then, extract job info using AI
    const extractRes = await fetch("/api/extract-job-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html: fetchData.html }),
    });

    if (!extractRes.ok) {
      throw new Error(`Extract API request failed: ${extractRes.status}`);
    }

    const extractData = await extractRes.json();
    if (extractData.error) {
      throw new Error(extractData.error);
    }

    return {
      title: extractData.title,
      company: extractData.company,
      location: extractData.location,
    };
  } catch (error) {
    console.error("AI extractJobInfoFromURL error:", error);
    return null;
  }
}
