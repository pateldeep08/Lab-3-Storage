export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

//import LevelDB = require('./leveldb')
import WriteStream from 'level-ws'


import encoding from 'encoding-down'
import leveldown from 'leveldown'
import levelup from 'levelup'

class LevelDB {
  static open(path: string) {
    const encoded = encoding(leveldown(path), { valueEncoding: 'json' })
    return levelup(encoded)
  }
}



export class MetricsHandler {
  private db: any 

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
    })
    stream.end()
  }

  public get(callback: (error: Error | null, result?: Metric[]) => void) {
    var resdata = new Array();
    const rs = this.db.createReadStream()
    .on('data', function (data : any) {
      resdata.push(data);
    })
    .on('error', function (err: any) {
      callback(err,[])
    })
    .on('close', function () {
      callback(null,resdata)
    })
    .on('end', function () {
      console.log('Stream ended')
    })
  }



  public getOne(key: string, callback: (error: Error | null, result?: Metric | null) => void) {
    if(key){this.db.get(key,(err,res) => {
      if(err) callback(err,null);
      else callback(null,res);
    })}else callback(new Error("no key provided"), null);
  }

  public delete(key: string, callback: (error: Error | null, result: any) => void) {
    this.db.del(key,(err: any,res: any) => {
      if(err) callback(err,null);
      else callback(null, res);
    });
  }



}





