# Kotlin Coroutines and Retrofit
##### September 25th, 2020 By Alex Hu

I wrote my own Android video player quite a few years ago (Gingerbread) in Java, and rewrote it in Kotlin using ExoPlayer.
It has been playing audio and video files in the phone's SD card all these time.

After a brief test with HLS, DASH and streaming MP4 files, I found that the [ProgressiveMediaSource](https://exoplayer.dev/progressive.html)
can handle high resolution MP4 files over my local network just fine. So I took some time adding support for streaming files
and have a private server provide the list of media files along with information such as name, URL and duration.
The server can also move and delete files when requested by the video player so it is a basic REST service.



### [Retrofit](https://androidpedia.net/en/tutorial/1132/retrofit2)

Retrofit turns your REST API into a Java interface. It uses annotations to describe HTTP requests, URL parameter replacement and
query parameter support is integrated by default.

Brandan Jones, Adjunct Assistant Professor at the University of Cincinnati, have a full course on
[Develop MVVM Android Apps with Q, Kotlin, LiveData, CircleCI, GitHub, Retrofit, and JSON](https://www.youtube.com/watch?v=OtZbZGfa4jk&list=PL73qvSDlAVVgRp1aUnPHO0P1nzU1HPj0-) which I highly recommend. It is like going back to school!

Later in the same playlist, [the code is refactored to use Kotlin Coroutines](https://www.youtube.com/watch?v=Yq0mXsk2teM&list=PL73qvSDlAVVgRp1aUnPHO0P1nzU1HPj0-&index=69)

Just be aware that if you subscribe to his channel, YouTube will start suggesting videos about plants :-)

### [Android Kotlin - Retrofit + Coroutines + Gson Fetch API Data - MVVM Tutorial Course](https://www.youtube.com/watch?v=RSYTn-O3r34&list=PLB6lc7nQ1n4jTLDyU2muTBo8xk0dg0D_w&index=2O3r34)

You should watch the first video in this YouTube playlist to setup your gradle dependancy, but long story short, you can setup
the GET and POST methods to the server with the following code, which is a lot less code than what I would have written by hand.

```
interface StreamingMediaService {

    @GET("api/media")
    fun browse(): Deferred<ArrayList<StreamingMediaFolder>>

    @GET("api/media/{name}")
    fun browse(@Path("name") name: String): Deferred<ArrayList<StreamingMediaFile>>

    @POST("api/media")
    @Headers("Content-Type: application/json", "Accept: application/json")
    fun execute(@Body action: StreamingMediaAction): Deferred<StreamingMediaResult>

    companion object {

        const val CONNECT_TIMEOUT_SECONDS = 1L

        operator fun invoke(): StreamingMediaService {

            val okHttpClient = OkHttpClient.Builder()
                    .connectTimeout(CONNECT_TIMEOUT_SECONDS, TimeUnit.SECONDS)
                    .build()
            return Retrofit.Builder()
                    .client(okHttpClient)
                    .baseUrl(getStreamingServerPath())
                    .addCallAdapterFactory(CoroutineCallAdapterFactory())
                    .addConverterFactory(GsonConverterFactory.create())
                    .build()
                    .create(StreamingMediaService::class.java)
        }
    }
}
```

### [Kotlin Coroutines](https://www.youtube.com/watch?v=BOHK_w09pVA)

A coroutine is a concurrency design pattern that you can use on Android to simplify code that executes asynchronously.
Consider coroutine a light weight thread, and a replacement for [AsyncTask](https://developer.android.com/reference/android/os/AsyncTask).

There are a lot of boilerplate code in AsyncTask and the syntax of AsyncTask is not natural. Consider the service above, we can
just call the StreamingMediaService.browse().

```
suspend fun getStreamingFolders(): List<String> {
    try {
        return mStreamingMediaService.browse().await()
    }
    catch (ex: Exception) {
        Logger.logException(ex)
    }
    return listOf()
}
```
And run the suspend function inside CoroutineScope.launch, like this:
```
CoroutineScope(Dispatchers.Main).launch {
    mStreamingFolders = getStreamingFolders()
}

```
