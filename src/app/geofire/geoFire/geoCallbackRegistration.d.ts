/**
 * Creates a GeoCallbackRegistration instance.
 */
export declare class GeoCallbackRegistration {
    private _cancelCallback;
    /**
     * @param _cancelCallback Callback to run when this callback registration is cancelled.
     */
    constructor(_cancelCallback: Function);
    /********************/
    /********************/
    /**
     * Cancels this callback registration so that it no longer fires its callback. This
     * has no effect on any other callback registrations you may have created.
     */
    cancel(): void;
}
