import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

import { useRecoilValue } from 'recoil';
import { ANIMATION } from './context';
import { Clock } from 'three';

export default function Scene() {
    const _ANIMATION = useRecoilValue(ANIMATION); 
    function Board() {
        const boardRef: React.MutableRefObject<any> = useRef();
        let clock = new Clock();
        useFrame(state => {
            let elapsedTime = clock.getElapsedTime();
            if(!boardRef.current) {
                return;
            }
            boardRef.current.rotation.set(Math.PI / 4, Math.sin(elapsedTime / 10) / 4, 0);
        })

        const board = useGLTF('/roulette/scene.gltf');
        const animations = useAnimations(board.animations, board.scene);
        useEffect(() => {
            if(_ANIMATION) {
                const action = animations.actions.Animation;
                action?.play();    
            }
        }, [_ANIMATION]);

        return <primitive 
            ref={boardRef} 
            rotation={[ Math.PI / 4, 0, 0 ]} 
            position={[0, 2, 0]} 
            object={board.scene} 
            scale={1.5}
            />
    }

    return (
        <Canvas style={{ zIndex: "0", height: '100%', width: "60%" }}>
            <PerspectiveCamera />
            <ambientLight args={['#a6a6a6', 1]} />
            <spotLight position={[10, 15, 10]} angle={0.3}></spotLight>
            <Board />
        </Canvas>
    );
}