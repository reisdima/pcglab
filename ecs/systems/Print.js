export default function Print(entities){
    let string = '';
    for(var i = 0; i < entities.length; i++)
    {
        string += entities[i].toString();
        if(i !== entities.length - 1)
        {
            string += '\n';
        }
    }
    return string;
}