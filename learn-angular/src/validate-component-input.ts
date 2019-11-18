export const validateComponentInput = (validateFn: (propValue: any) => boolean) => {
  return (component: any, propKey: any) => {
    const NG_LIFECYCLE = 'ngOnChanges';
    // tslint:disable-next-line:ban-types
    const ngOnInitClone: Function | null = component[NG_LIFECYCLE];
    Object.defineProperty(component, NG_LIFECYCLE, {
      value() {
        console.log('TCL: value -> this', this);

        const notValidated = !validateFn.call(this, this[propKey]) as boolean;
        if (notValidated) {
          console.error(`${component.constructor.name} : ${propKey} is not passed by your validate function ${validateFn.name} `);
        }
        if (ngOnInitClone) {
          ngOnInitClone.call(this);
        }
      },
    });
  };
};
