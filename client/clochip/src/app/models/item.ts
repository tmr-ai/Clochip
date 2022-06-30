export class Item {

    idItem: string
    fidUser: string
    tsCreated: string
    tsChanged: string
    tsLastRead: string
    txtName: string
    txtDescription: string
    txtSize: string
    enumCut: Cut
    setColor: [string]
    setMaterial: [string]
    setType: string
    txtSetColor: string = ''
    txtSetMaterial: string = ''
    txtSetType: string = ''
    enumCondition: Condition
    blnDirty: boolean
    blnFavorite: boolean = false
    blobImage
    enumWeather: string

    nmbTemperature: number
    nmbSpinningCycles: number
}

enum Cut {
    slim = "slim",
    regular = "regular",
    loose = "loose"
}

enum Condition {
    New = "New",
    LikeNew = "Like new",
    Worn = "Worn",
    WellWorn = "Well worn",
    Broken = "Broken"
}


enum Weather {
  Cold = "Cold",
  Warm = "Warm",
  Hot = "Hot"
}
