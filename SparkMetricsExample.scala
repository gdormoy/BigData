package fr.xebia.xke

import org.apache.spark.sql.functions._
import org.apache.spark.sql.SparkSession
import org.apache.hadoop.fs.{FileSystem, Path}

import scala.util.Random

object SparkMetricsExample {
  val APP_NAME = "spark-metrics-example"
  def main(args: Array[String]): String = {
    implicit val spark = SparkSession.builder.getOrCreate()
    println(spark)
    val sc = spark.sparkContext
    val files = FileSystem.get(sc.hadoopConfiguration).listFiles(new Path("./all_tweets"), true)

    //val files = getListOfFiles("/all_tweets")
    val path = files.next().getPath.toString
    var fullDf = spark.read.json(path)
    val last_timestamp = sys.env("LAST_TIMESTAMP")
    println(last_timestamp)
    while(files.hasNext){
      val pathtmtc = files.next().getPath.toString
      println("BONJOUR A TOUS ////////////////////////////////////////////////////////////////////////////////////:")
      val timestamp = pathtmtc.reverse.split("_")(0).reverse.split("\\.")(0)
      println(last_timestamp.toInt)
      if(last_timestamp.toInt < timestamp.toInt){
        fullDf = fullDf.union(spark.read.json(pathtmtc))
      }
    }
    fullDf.groupBy("hashtags").count().orderBy(desc("count")).limit(10).show()
    spark.stop()
    return "stopped"
  }
}