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
    setColor: Set<string>
    setMaterial: Set<string>
    setType: Set<string>
    enumCondition: Condition
    blnDirty: boolean
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