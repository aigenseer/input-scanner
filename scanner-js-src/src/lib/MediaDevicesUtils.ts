export type IMediaDevices =
{
    label: string;
    id: string;
}

export default class MediaDevicesUtils{

    public static getVideoMediaDevices(): Promise<IMediaDevices[]>{
        return new Promise(async (resolve: any, reject: any)=>{
            try {
                let mediaDeviceInfos = await navigator.mediaDevices.enumerateDevices();
                let devices = mediaDeviceInfos.filter(e => e.deviceId.length > 0 && e.kind === 'videoinput')
                    .map((e: MediaDeviceInfo) => ({ label: e.label.replace(/ (\(.*?\))/g, ''), id: e.deviceId }));
                resolve(devices);
            } catch (err) {
                reject(err);
            }
        });
    }

    public static getPermission(): Promise<boolean>
    {
        return new Promise(async (resolve: any, reject: any)=>{
            try {
                let devices = await MediaDevicesUtils.getVideoMediaDevices()
                if(devices.length === 0){
                    resolve(await MediaDevicesUtils.getMediaDevicesPermission());
                }else resolve(true);
            }catch (err){
                resolve(false);
            }
        });
    }


    private static getMediaDevicesPermission(): Promise<boolean>
    {
        return new Promise((resolve: any, reject: any)=>{
            navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
                stream.getTracks().forEach(function(track) {
                    track.stop();
                });
                resolve(true);
            }).catch(err => resolve(false))
        });
    }


}